package com.chaoxing.gsd.exception;
/**
 * 自定义shiro异常
 * @author winsl
 *
 */
public class KCException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/** http请求状态码**/
	int httpStatus;
	
	public KCException(String str)
	{
		super(str);
	}
	
	public KCException(String str, int httpStatus)
	{
		super(str);
		this.httpStatus = httpStatus;
	}
}
