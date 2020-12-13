var path = require('path');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        filename: 'pong.js',
        path: path.resolve(__dirname, 'dist')
    }
};
