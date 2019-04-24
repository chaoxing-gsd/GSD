package com.chaoxing.gsd.shiro;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 自定义获取用户信息
 * 
 * @author winsl
 *
 */
public class MyShiroRealm extends AuthorizingRealm {

	private static Logger logger = LoggerFactory.getLogger(MyShiroRealm.class);

	// private static final String PASS_PREFIX = "pass";

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		logger.debug("MyShiroRealm.doGetAuthenticationInfo()");

		// 获取用户的输入的账号.
		String username = "winsli";// (String)token.getPrincipal();
		String password = "44960";// (String)token.getCredentials();
		/*
		 * String temp = password.substring(4, password.length());
		 * if(password.startsWith(PASS_PREFIX)) {
		 * 
		 * // 密码方式登录
		 * 
		 * } else { // 验证码方式登录，先通过验证码获取密码再通过密码登录
		 * 
		 * }
		 */
		logger.debug("user name is:{} password is:{}", username, password);

		// 通过username从数据库中查找 User对象，如果找到，没找到.
		// 实际项目中，这里可以根据实际情况做缓存，如果不做，Shiro自己也是有时间间隔机制，2分钟内不会重复执行该方法

		/*
		 * UserInfo userInfo = userInfoService.findByUsername(username);
		 * logger.debug("user name is:{}", username); if(userInfo == null){
		 * return null; }
		 */
		SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(username, // 用户名
				password, // 密码
				ByteSource.Util.bytes(username.concat(password)), // salt=username+salt
				getName() // realm name
		);
		return authenticationInfo;
	}

}
