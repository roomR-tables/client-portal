const dev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './controllers/index.js',
    devtool: dev ? 'source-map' : false,
    mode: dev ? 'development' : 'production',
    output: {
        library: 'app',
        filename: 'app.js',
        path: require('path').resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};