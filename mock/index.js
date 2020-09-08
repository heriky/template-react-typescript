module.exports = {
    '/app': {
        post: {
            code: 200,
            message: 'SUCCESS',
            data: 'faccf90b7d90418c9042495594c3851b',
        },
        get: {
            code: 200,
            message: 'SUCCESS',
            data: [
                {
                    id: '3469f9876623422ebabedd88be36016d',
                    appKey: 'faccf90b7d90418c9042495594c3851b',
                    appName: '互动赢家',
                    createUser: 'admin',
                    createTime: '2020-08-26T13:57:17.054+0800',
                },
            ],
        },
    },
    '/app/:id': {
        delete: {
            code: 200,
            message: 'SUCCESS',
            data: null,
        },
    },
};
