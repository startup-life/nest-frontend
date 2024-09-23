# Node.js 20 버전의 기본 이미지를 사용
FROM node:20

# 컨테이너 내에서 /usr/src/app 디렉토리를 작업 디렉토리로 설정
WORKDIR /usr/src/app

# package.json 파일들을 작업 디렉토리로 복사
COPY package*.json ./

# 모든 의존성 설치 (devDependencies 포함)
RUN npm install

# 애플리케이션 소스 파일들을 작업 디렉토리로 복사
COPY . .

# 컨테이너가 노출할 포트
EXPOSE 8080

# 애플리케이션 실행
CMD ["npm", "run", "dev"]