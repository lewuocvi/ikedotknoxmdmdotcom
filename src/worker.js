/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
        // Parse the URL to get the query parameters
        const url = new URL(request.url);
        const domain = url.searchParams.get('domain');

        if (!domain) {
            return new Response('Domain parameter is missing', { status: 400 });
        }

        console.log({ domain });
        const dnsUrl = `https://cloudflare-dns.com/dns-query?name=${domain}`;
        const response = await fetch(dnsUrl, {
            headers: {
                Accept: 'application/dns-json',
            },
        });

        if (!response.ok) {
            return new Response('Failed to fetch DNS data', { status: 500 });
        }

        const jsonData = await response.json();
        return new Response(JSON.stringify(jsonData['Answer']), {
            headers: { 'Content-Type': 'application/json' },
        });
    },
};