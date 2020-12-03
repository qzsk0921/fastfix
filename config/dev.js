// 编译过程中，环境变量的值会被替换为相应字符，对于字符串类型的值，要多嵌套一层引号
module.exports = {
  API_BASE_URL: "'http://192.168.1.76:31999/'",
  REDIRECT_URI: "'http://fastfix.1stlive.net'"
  // REDIRECT_URI: "'cdn.1stlive.net/fastfix/index.html'",
}