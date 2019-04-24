package com.chaoxing.gsd.core.filter;

import org.apache.catalina.filters.RemoteIpFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


@Configuration
public class ConfigurationFilter {

	private static Logger logger = LoggerFactory.getLogger(ConfigurationFilter.class);

	@Bean
	public RemoteIpFilter remoteIpFilter() {
		return new RemoteIpFilter();
	}


	@Bean
	public FilterRegistrationBean<ChaoxingWebFilter> filterRegistration(){
		FilterRegistrationBean<ChaoxingWebFilter> registration = new FilterRegistrationBean<ChaoxingWebFilter>();
		registration.setFilter(new ChaoxingWebFilter());

		//设置过滤路径，/*所有路径
		registration.addUrlPatterns("/*");
		registration.setName("ChaoxingWebFilter");

		//设置优先级
		registration.setOrder(1);
		return registration;
	}


	public class ChaoxingWebFilter implements Filter {
		@Override public void init(FilterConfig filterConfig) throws ServletException {

		}

		@Override
		public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
				FilterChain filterChain) throws IOException, ServletException {

			HttpServletRequest request = (HttpServletRequest) servletRequest;
			logger.info("this is ChaoxingWebFilter,url :{}", request.getRequestURI());
			filterChain.doFilter(servletRequest, servletResponse);
		}

		@Override
		public void destroy() {
			// TODO Auto-generated method stub
		}


	}

}
