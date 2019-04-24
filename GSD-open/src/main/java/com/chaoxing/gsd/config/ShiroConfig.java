package com.chaoxing.gsd.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.shiro.mgt.SecurityManager;

import com.chaoxing.gsd.shiro.MyShiroRealm;
import com.chaoxing.gsd.shiro.OAuth2Filter;
/**
 * shiro配置
 * @author winsl
 *
 */
@Configuration
public class ShiroConfig {
	
	private static Logger logger = LoggerFactory.getLogger(ShiroConfig.class);

	@Bean
	public ShiroFilterFactoryBean shirFilter(SecurityManager securityManager, OAuth2Filter oAuth2Filter) {
		logger.info("ShiroConfiguration.shirFilter() start.");
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);
		
		//拦截器.
		Map<String,String> filterChainDefinitionMap = new LinkedHashMap<String,String>();
		
		// 配置不会被拦截的链接 顺序判断
		filterChainDefinitionMap.put("/gsd/getalldefaultlib", "anon");
		filterChainDefinitionMap.put("/gsd/search2", "anon");
		filterChainDefinitionMap.put("/gsd/definedsearch", "anon");
		filterChainDefinitionMap.put("/gsd/login", "anon");
		
		//配置退出 过滤器,其中的具体的退出代码Shiro已经替我们实现了
		filterChainDefinitionMap.put("/logout", "logout");
		
		//<!-- 过滤链定义，从上向下顺序执行，一般将/**放在最为下边 -->:这是一个坑呢，一不小心代码就不好使了;
		//<!-- authc:所有url都必须认证通过才可以访问; anon:所有url都都可以匿名访问-->
		filterChainDefinitionMap.put("/**", "authc");

		//未授权界面;
		shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		shiroFilterFactoryBean.getFilters().put("authc", oAuth2Filter);
		return shiroFilterFactoryBean;
	}

	@Bean
	public MyShiroRealm myShiroRealm(){
		MyShiroRealm myShiroRealm = new MyShiroRealm();
		return myShiroRealm;
	}


	@Bean
	public SecurityManager securityManager(MyShiroRealm bean){
		DefaultWebSecurityManager securityManager =  new DefaultWebSecurityManager();
		securityManager.setRealm(bean);
		return securityManager;
	}
	
	@Bean
	public OAuth2Filter oAuth2Filter()
	{
		OAuth2Filter filter = new OAuth2Filter();
		return filter;
	}
}
