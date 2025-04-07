/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Aviso: Isso permite que builds de produção sejam concluídos com sucesso
    // mesmo que o projeto tenha erros do ESLint.
    ignoreDuringBuilds: true,
  },
  // Outras configurações do Next.js podem ser adicionadas aqui
};

module.exports = nextConfig;
