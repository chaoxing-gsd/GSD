package com.chaoxing.gsd.core.utils;

import java.util.Date;

import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * jwt工具类
 * 
 * @author winsl
 *
 */
@ConfigurationProperties(prefix = "jwt")
@Component
public class JwtUtils {
	/**
	 * logger
	 */
	private Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	/**
	 * 密钥
	 */
	private String secret;
	/**
	 * 有效期限
	 */
	private int expire;
	/**
	 * 存储 token
	 */
	private String token;

	/**
	 * 存储用户id
	 */
	private String userid;

	/**
	 * 生成jwt token
	 *
	 * @param userId
	 *            用户ID
	 * @return token
	 */
	public String generateToken(String userId) {
		Date nowDate = new Date();
		String at = Jwts.builder().setHeaderParam("typ", "JWT")
				// 后续获取 subject 是 userid
				.setSubject(userId).setIssuedAt(nowDate).setExpiration(DateUtils.addDays(nowDate, expire))
				// 这里我采用的是 HS512 算法
				.signWith(SignatureAlgorithm.HS512, secret).compact();
		logger.debug("at is : {}", at);
		return at;
	}

	/**
	 * 解析 token， 利用 jjwt 提供的parser传入秘钥，
	 *
	 * @param token
	 *            token
	 * @return 数据声明 Map<String, Object>
	 */
	public Claims getClaimByToken(String token) {
		try {
			return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * token是否过期
	 *
	 * @return true：过期
	 */
	public boolean isTokenExpired(Date expiration) {
		return expiration.before(new Date());
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public int getExpire() {
		return expire;
	}

	public void setExpire(int expire) {
		this.expire = expire;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
