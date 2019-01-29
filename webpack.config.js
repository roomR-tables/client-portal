const dev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './controllers/index.jsx',
    devtool: dev ? 'source-map' : false,
    mode: dev ? 'development' : 'production',
    output: {
        path: require('path').resolve('dist'),
        filename: 'app.js',
        publicPath: "dist/",
        library: 'app'
    },
    module: {
        rules: [
            {
                test: /\.m?jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    }
};