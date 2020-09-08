// excludes default libs such as 'dom' conflicting with 'webworker'
// this should be what you use in your scripts
/// <reference lib="esnext" />
/// <reference lib="webworker" />

export declare let self: ServiceWorkerGlobalScope;

/* ============type definition=============== */
const version = 'v1';

// 缓存策略分三类：1.从来不缓存的资源 2. 优先读缓存，无缓存时才触发请求 3. 有缓存则优先返回缓存，并且无论是否匹配缓存，都发送请求更新缓存。
const cachedFirstList = [
    /\.js$/, // register时不设置scope，控制顶层域名
    /\.css$/,
    /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|ico)(\?.*)?$/,
];

const notCachedList = [
    /\.html$/, // html中包含动态的js和css，所以从来不走缓存
    /\.hot-update\.json$/,
    /sockjs-node\/info$/,
];

// performance.getEntriesByType

// install => active => fetch
// serviceWoker一旦加载就立即运行install； 新的worker在后台安装，但是如果旧的worker还在运行，那么新的worker就只install而不激活。
// 当没有任何已加载的页面使用旧的worker的时候，新的版本才会激活，才会触发active方法。

// install阶段一般用于生成换粗列表
self.addEventListener('install', event => {
    console.log('Woker: install event in progress');

    self.skipWaiting(); // 强制让等待中的worker变成激活状态！

    async function initCaches() {
        // 由于cache.match不管有没有匹配都会执行then，所以缓存策略在fetched中做了，不在这里手动填写了
        // const cache = await caches.open(version + 'fundamentals');
        // cache.addAll(['/web-agent-monitor-api/v1']);
    }

    // 延长install的周期
    event.waitUntil(initCaches);
});

self.addEventListener('fetch', event => {
    // console.log('Woker: fetch event in progress');

    // console.log(event.request.url);
    // 应该只处理get请求, 只处理http/https
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        // console.log('Worker: fetch event ignored', event.request.method, event.request.url);
        return;
    }

    event.respondWith(
        // 如果未匹配到，则cached为undefined, 而不是走异常catch
        caches.match(event.request).then(cached => {
            const networkFn = () =>
                fetch(event.request)
                    .then(fetchedFromNetwork, unableToResolve)
                    .catch(unableToResolve);

            // 策略1： 从来不走缓存的资源
            if (notCachedList.some(rule => rule.test(event.request.url))) {
                return networkFn();
            }
            // 策略2： 一些特定的静态资源（cdn），优先使用缓存，没有缓存才发请求
            if (cachedFirstList.some(rule => rule.test(event.request.url))) {
                return cached || networkFn();
            }

            // 策略3：优先使用缓存，并且一定会发请求更新缓存
            const networked = networkFn();
            return cached || networked;
        })
    );

    // 请求成功了。先存一下，然后返回原来的response
    function fetchedFromNetwork(response: Response) {
        const cacheCopy = response.clone();
        // console.log('Worker: fetch response from network.', event.request.url);

        caches
            .open(version + 'pages')
            .then(cache => {
                cache.put(event.request, cacheCopy);
            })
            .catch(() => {
                // console.log('WORKER: fetch response stored in cache.', event.request.url);
            });
        return response;
    }

    // 请求失败了，可以做很多事情：1. return caches.match('/some/cached/img.png') 2. 自定义一个
    function unableToResolve() {
        console.warn(`Worker: resource <${event.request.url}> fetch failed`);
        return new Response();
        // return new Response('<h1>Servcie Unavailable</h1>', {
        //     status: 503,
        //     statusText: 'Servcie Unavailable',
        //     headers: new Headers({
        //         'Content-type': 'text/html',
        //     }),
        // });
    }
});

// active阶段，一般用于删除旧的所有缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(keys => {
                // 删除旧版本
                return Promise.all(
                    keys.filter(key => !key.startsWith(version)).map(key => caches.delete(key)) // 删除任务
                ).then(() => {
                    console.log('🎉🎉🎉Woker: activate complete 😊');
                });
            })
            .catch(() => {
                console.log('Woker: activate error');
            })
    );
});

// 通过self.clients.matchAll().map(client => client.postMessage)的形式向所有调用serviceWorker的地方都发送message
// 也可以通过event.clientId来获取特定的client. 如下： self.clients.match(event.clientId).then(client => client.postMessage)
