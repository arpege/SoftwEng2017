FROM centos:latest
RUN curl -sL https://rpm.nodesource.com/setup | bash -
RUN yum install -y nodejs
# Set in what directory commands will run
ADD /src/* /src/
WORKDIR /src


RUN npm install github
RUN npm install json2csv --save
RUN npm install

EXPOSE 8080
CMD ["node", "getTravisGithubData.js"]
