type ProxyAuth = {
    username: string;
    password: string;
}

type CustomProxy = {
    protocol: string;
    host: string;
    port: number;
    auth: ProxyAuth;
}

export const Socks5Proxy: CustomProxy = {
    protocol: 'socks5',
    host: process.env.PROXY_HOST!,
    port: parseInt(process.env.PROXY_PORT!),
    auth: {
        username: process.env.PROXY_USER != undefined ? process.env.PROXY_USER : "",
        password: process.env.PROXY_PASS != undefined ? process.env.PROXY_PASS : ""
    }
}
