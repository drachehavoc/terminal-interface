// servidor pra listar ips que acessaram a pagina sem express com bun ipv6 e ipv4
import { serve } from "bun";

const PORT = 3000;
const ACCESS_LOG = "./access.log";

function detectIpType(ip: string | null): string {
  if (!ip) return "unknown";
  if (ip.includes(":")) return "IPv6";
  if (ip.includes(".")) return "IPv4";
  return "unknown";
}

serve({
  port: PORT,
  hostname: "::", // Escuta em IPv6 (aceita IPv4 também via dual-stack)
  async fetch(request) {
    // Tenta obter o IP de vários headers
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("fastly-client-ip") ||
      request.headers.get("true-client-ip") ||
      request.headers.get("x-client-ip") ||
      request.headers.get("x-forwarded") ||
      request.headers.get("forwarded-for") ||
      request.headers.get("forwarded") ||
      request.headers.get("via") ||
      request.headers.get("remote-addr") ||
      request.socket.remoteAddress ||
      "unknown";

    const ipType = detectIpType(clientIp);
    const timestamp = new Date().toISOString();
    
    // Log detalhado
    const logEntry = `${timestamp} - ${ipType} - ${clientIp}\n`;
    await Bun.write(ACCESS_LOG, logEntry, { append: true });

    // Resposta informativa com o IP detectado
    const responseText = `HELLO\n`;
    
    return new Response(responseText, { 
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  },
});

console.log(`Server running on http://[::]:${PORT}/ (IPv4 and IPv6)`);