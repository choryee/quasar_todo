FROM nginx:stable-alpine
COPY dist/spa/ /usr/share/nginx/html/
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
# Nginx를 기본 설정(데몬 모드)으로 실행
CMD ["nginx"]
