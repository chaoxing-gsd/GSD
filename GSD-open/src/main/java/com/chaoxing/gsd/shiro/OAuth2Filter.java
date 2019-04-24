package com.chaoxing.gsd.shiro;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import com.alibaba.fastjson.JSON;
import com.chaoxing.gsd.core.utils.JwtUtils;
import com.chaoxing.gsd.exception.Code;
import com.chaoxing.gsd.exception.KCException;
import com.chaoxing.gsd.web.res.BaseResponse;

import io.jsonwebtoken.Claims;

/**
 * 自定义shiro拦截器，改为 JWT 认证
 * 
 * @author winsl
 *
 */
public class OAuth2Filter extends FormAuthenticationFilter {
	/**
	 * 设置 request 的键，用来保存 认证的 userID,
	 */
	private final static String USER_ID = "USER_ID";
	
	private final static String NEW_AT = "NEW_AT";

	@Resource
	private JwtUtils jwtUtils;

	/**
	 * logger
	 */
	private static final Logger logger = LoggerFactory.getLogger(OAuth2Filter.class);
	
	private static final Set<String> WHITE_URL = new LinkedHashSet<String>();
	
	static
	{
		WHITE_URL.add("/gsd/getalldefaultlib");
		WHITE_URL.add("/gsd/search2");
		WHITE_URL.add("/gsd/definedsearch");
		WHITE_URL.add("/gsd/login");
		WHITE_URL.add("/gsd/register");
		WHITE_URL.add("/gsd/searchclusters");
		WHITE_URL.add("/gsd/searchallcluster");

		// 用户留言
		WHITE_URL.add("/gsd/addLeavingMessage");
		
		// 用户采集分享
		WHITE_URL.add("/gsd/es/searchindexbyid");
		
		// 三维过滤接口
		WHITE_URL.add("/gsd/es/searchclusters3");
	}

	/**
	 * shiro权限拦截核心方法 返回true允许访问resource，
	 *
	 * @param request
	 * @param response
	 * @param mappedValue
	 * @return
	 */
	@Override
	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
		String url = ((HttpServletRequest) request).getRequestURI();
		logger.info("OAuth2Filter isAccessAllowed url is:[{}]", url);
		
		// 白名单url不做校验
		if(WHITE_URL.contains(url))
		{
			return true;
		}
		String token = getRequestToken((HttpServletRequest) request, jwtUtils.getToken());
		String userId = null, needCheckUserId = null;
		Map<String, String> data = null;
		try {

			data = getUserIdFromToken(token);
			userId = data.get(USER_ID);
			
			if(data.get(NEW_AT) != null)
			{
				onLoginFail(response, Code.AT_OVERTIME);
				logger.warn("OAuth2Filter isAccessAllowed userId is:{}, time is over!!!", userId);
				return false;
			}
			needCheckUserId = getRequestToken((HttpServletRequest) request, jwtUtils.getUserid());
			logger.info("need check user id is: {}", needCheckUserId);
			
			// 再验证请求头中userid和at中解析得到的是否是同一个
			if (null != userId && userId.equals(needCheckUserId)) {
				
				// 存入到 request 中，在后面的业务处理中可以使用
				request.setAttribute(USER_ID, userId);
				logger.info("OAuth2Filter isAccessAllowed userId is:{}", userId);
				
				return true;
			} else {
				logger.info("OAuth2Filter isAccessAllowed userId is:{}, but is not need.", userId);
				onLoginFail(response, Code.AT_NOT_THIS_USER);
				return false;
			}

		} catch (KCException e) {
			logger.info("OAuth2Filter isAccessAllowed error is:{}", e);
			
			// 身份验证失败，返回 false 将进入onAccessDenied 判断是否登陆。
			onLoginFail(response, Code.AT_ILLEGAL);
			return false;
		}
	}

	/**
	 * 当访问拒绝时是否已经处理了； 如果返回true表示需要继续处理； 如果返回false表示该拦截器实例已经处理完成了，将直接返回即可。
	 *
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@Override
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
		if (isLoginRequest(request, response)) {
			if (isLoginSubmission(request, response)) {
				return executeLogin(request, response);
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	/**
	 * 鉴定失败，返回错误信息
	 * 
	 * @param token
	 * @param e
	 * @param request
	 * @param response
	 * @return
	 */
	@Override
	protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request,
			ServletResponse response) {
		try {
			((HttpServletResponse) response).setStatus(HttpStatus.BAD_REQUEST.value());
			BaseResponse rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setMsg("Account or password error!!!");
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().print(JSON.toJSONString(rsp));
		} catch (IOException e1) {
			logger.error(e1.getMessage(), e1);
		}
		return false;
	}

	/**
	 * token 认证失败
	 *
	 * @param response
	 */
	private void onLoginFail(ServletResponse response, String code) {
		((HttpServletResponse) response).setStatus(HttpStatus.UNAUTHORIZED.value());
		try {
			BaseResponse rsp = new BaseResponse();
			rsp.setStatu(false);
			rsp.setCode(code);
			rsp.setMsg("No privileges, please contact the administrator!!!");
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().print(JSON.toJSONString(rsp));
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 从请求中根据key获取相应值
	 * 
	 * @param httpRequest
	 * @return
	 */
	private String getRequestToken(HttpServletRequest httpRequest, String key) {

		// 从header中获取token
		String token = httpRequest.getHeader(key);

		// 如果header中不存在token，则从参数中获取token
		if (StringUtils.isBlank(token)) {
			return httpRequest.getParameter(key);
		}
		if (StringUtils.isBlank(token)) {

			// 从 cookie 获取 token
			Cookie[] cookies = httpRequest.getCookies();
			if (null == cookies || cookies.length == 0) {
				return null;
			}
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(key)) {
					token = cookie.getValue();
					break;
				}
			}
		}
		return token;
	}

	/**
	 * 根据 token 获取 userID
	 *
	 * @param token
	 *            token
	 * @return userId
	 */
	private Map<String, String> getUserIdFromToken(String token) throws KCException {
		logger.info("need check token is: {}", token);
		Map<String, String> out = new HashMap<String, String>();
		if (StringUtils.isBlank(token)) {
			throw new KCException("无效 token，内容为空", HttpStatus.UNAUTHORIZED.value());
		}
		Claims claims = jwtUtils.getClaimByToken(token);
		if (claims == null) {
			throw new KCException(jwtUtils.getToken() + "非法，验签失败", HttpStatus.UNAUTHORIZED.value());
		}
		
		out.put(USER_ID, claims.getSubject());
		
		// 登录超时
		if(jwtUtils.isTokenExpired(claims.getExpiration()))
		{
			// 生成新的at
			out.put(NEW_AT, "xxxxx");//jwtUtils.generateToken(claims.getSubject()));
		}
		
		return out;
	}
}
