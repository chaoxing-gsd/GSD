package com.chaoxing.esimportdata;

/**
 * @Author: longrui
 * @Date: 2018/3/14 10:35
 */
public class JdbcTemplateException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public JdbcTemplateException() {
		super();
	}

	public JdbcTemplateException(String message) {
		super(message);
	}

	public JdbcTemplateException(String message, Throwable cause) {
		super(message, cause);
	}
}
