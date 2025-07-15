FROM node:22.15
WORKDIR /app

# 依存関係のインストール用にpackage.jsonとlockファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# ポート3000を公開（Next.jsのデフォルト）
EXPOSE 3000

# 開発サーバーの起動
CMD ["npm", "run", "dev"]