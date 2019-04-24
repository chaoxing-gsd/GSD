package com.chaoxing.gsd.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.TransactionManagementConfigurer;

/**
 * mybatis配置事务
 * @author winsl
 *
 */
@Configuration
@EnableTransactionManagement 
public class MybatisConfig implements TransactionManagementConfigurer{

	@Autowired
    DataSource dataSource;
	
	@Bean
	@Override
	public PlatformTransactionManager annotationDrivenTransactionManager() {
		// TODO Auto-generated method stub
		return new DataSourceTransactionManager(dataSource);
	}

}
