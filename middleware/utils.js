import jwt from 'jsonwebtoken';
import axios from 'axios';
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router';

const SECRET_KEY = process.env.JWT_KEY;

export function verifyToken(jwtToken) {
  try {
    return jwt.verify(jwtToken, SECRET_KEY);
  } catch (e) {
    console.log('e:', e);
    return null;
  }
}
export function getAppCookies(req) {
  const parsedItems = {};
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split('; ');
    cookiesItems.forEach(cookies => {
      const parsedItem = cookies.split('=');
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
  }
  return parsedItems;
}
export function absoluteUrl(req, setLocalhost) {
  var protocol = 'https:';
  var host = req
    ? req.headers['x-forwarded-host'] || req.headers['host']
    : window.location.host;
  if (host.indexOf('localhost') > -1) {
    if (setLocalhost) host = setLocalhost;
    protocol = 'http:';
  }
  return {
    protocol: protocol,
    host: host,
    origin: protocol + '//' + host,
    url: req,
  };
}

export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
// const api = process.env.PUBLIC_URL

export const apiInstance = () => {
  return axios.create({
    baseURL: '/api',
    // headers,
  })
}

export const checkIsLogin = () => {
  // console.log("checkIsLogin")
  var token = Cookies.get('token') // => 'value'
  if (!token) {
    Router.push('/index');
    return;
  }
  // console.log(parseJwt(token))
  return parseJwt(token)

}

function parseJwt(token) {

  var isExpired = false;
  // const token = localStorage.getItem('id_token');



  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  var _jsonPayload = JSON.parse(jsonPayload)
  var dateNow = new Date();
  if (parseInt(_jsonPayload.exp) < parseInt((dateNow.getTime()).toString().substring(0,10))) {
    console.log("true")

    isExpired = true;
  }

  if (isExpired) {
    Router.push('/index');
    return "";
  }
  return _jsonPayload;
};