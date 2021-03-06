
import path from "path";
import webpack from "webpack";

class WatchMessagePlugin {
    public apply(compiler: webpack.Compiler) {
        compiler.hooks.watchRun.tap("WatchMessagePlugin", () => {
            console.log("\n\x1b[36m" + "Begin compile at " + new Date() + " \x1b[39m");
        });
        compiler.hooks.beforeRun.tap("WatchMessagePlugin", () => {
            console.log("\n\x1b[36m" + "Begin compile at " + new Date() + " \x1b[39m");
        });
        compiler.hooks.done.tap("WatchMessagePlugin", () => {
            setTimeout(() => {
                console.log("\n\x1b[36m" + "Done compile at " + new Date() + " \x1b[39m");
            }, 30);
        });
    }
}

const config: webpack.Configuration = {
    mode: "development",
    entry: "./src/main.ts",
    devtool : "source-map",
    plugins: [
        new WatchMessagePlugin(),
        new webpack.ProgressPlugin(),
    ],

    output: {
        publicPath: "/",
        // clean: true,
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                include: [path.resolve(__dirname, "src")],
                exclude: [/node_modules/],
            }, 
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /manifest.json$/,
                type: "asset/resource",
                generator: {
                    filename: "[name][ext][query]",
                },
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};

export default config;
