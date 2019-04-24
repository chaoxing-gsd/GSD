package com.chaoxing.esimportdata;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
/**
 * MySQL数据库操作
 * @author winsl
 *
 */
public class JdbcTemplateUtil {

	/**
	 * spring提供的操作jdbc的工具类
	 */
	private static JdbcTemplate jdbcTemplate = new JdbcTemplate();

	static {
		DataSourceBuilder<?> dataSource = DataSourceBuilder.create();
		dataSource.username("db_username");
		dataSource.password("db_password");
		dataSource.driverClassName("com.mysql.jdbc.Driver");
		dataSource.url("xxxx");
		// xxxx 是mysql数据库链接url，形如：jdbc:mysql://IP:port/dbname?useSSL=false&useUnicode=true&characterEncoding=utf-8
		jdbcTemplate.setDataSource(dataSource.build());
	}

	/**
	 * 查询数量
	 *
	 * @param sql
	 *            要查询的sql语句，参数用?代替
	 * @return
	 */
	public static int queryCount(String sql, Object[] para) throws JdbcTemplateException {
		checkSqlStr(sql);
		return jdbcTemplate.queryForObject(sql, para, Integer.class);
	}

	/**
	 * 查询单条数据
	 *
	 * @param sql
	 *            要查询的sql语句，参数用?代替
	 * @param Class
	 *            实体类的class对象，映射属性
	 * @param args
	 *            sql语句中的参数值,可以为空
	 * @return
	 */
	public static Object querySingle(String sql, Class<?> Class, Object... args) throws JdbcTemplateException {
		checkSqlStr(sql);
		RowMapper<?> rowMapper = new BeanPropertyRowMapper<Object>();
		return jdbcTemplate.queryForObject(sql, rowMapper, args);
	}

	/**
	 * 通过反射获取字段值
	 * 
	 * @param sql
	 * @param cls
	 * @param args
	 * @return
	 * @throws JdbcTemplateException
	 */
	public static <T> List<T> queryList(String sql, Class<T> cls, Object... args) throws JdbcTemplateException {
		checkSqlStr(sql);
		return jdbcTemplate.query(sql, new RowMapper<T>() {
			@Override
			public T mapRow(ResultSet rs, int rowNum) throws SQLException {

				// 反射获取字段属性信息，并将数据库查询值赋值

				T out = null;
				try {
					out = cls.newInstance();
				} catch (InstantiationException e) {
					System.err.println("InstantiationException error!!!");
					return out;
				} catch (IllegalAccessException e) {
					System.err.println("IllegalAccessException error!!!");
					return out;
				}

				// 获取类中的全部定义字段
				Field[] fields = cls.getDeclaredFields();
				String filedStr = null, filedName = null;

				// 循环遍历字段，获取字段相应的属性值
				for (Field field : fields) {
					// 假设不为空。设置可见性，然后返回
					field.setAccessible(true);
					Class<?> temp = field.getType();
					filedStr = temp.toString();
					filedName = field.getName();

					try {
						if (filedStr.endsWith("java.lang.String")) {
							field.set(out, rs.getString(filedName));
						} else if (filedStr.endsWith("java.lang.Integer")) {
							field.set(out, rs.getInt(filedName));
						} else if (filedStr.endsWith("java.util.Date")) {
							field.set(out, rs.getDate(filedName));
						} else if (filedStr.endsWith("java.lang.Long")) {
							field.set(out, rs.getLong(filedName));
						} else if (filedStr.endsWith("java.lang.Double")) {
							field.set(out, rs.getDate(filedName));
						}
						/*
						 * if(filedStr.endsWith("java.lang.Character")) {
						 * field.set(out, rs.getCharacterStream(filedName)); }
						 */
						else if (filedStr.endsWith("java.lang.Boolean")) {
							field.set(out, rs.getBoolean(filedName));
						} else {
							System.err.println("class " + cls.getClass().getName() + " have not right field!!!");
							System.err.println("filedStr is :" + filedStr);
						}
					} catch (IllegalArgumentException | IllegalAccessException e) {
						System.err.println("class " + cls.getClass().getName() + " set field value error!!!");
					}
				}

				return out;
			}
		}, args);
	}

	/**
	 * 新增，更新，删除
	 *
	 * @param sql
	 *            要查询的sql语句，参数用?代替
	 * @param args
	 *            sql语句中的参数值,可以为空
	 * @return
	 */
	public static int updateOperate(String sql, Object... args) throws JdbcTemplateException {
		checkSqlStr(sql);
		return jdbcTemplate.update(sql, args);
	}

	/**
	 * 校验sql参数，不能为空,此校验不全，后面再补充
	 *
	 * @param sql
	 * @throws JdbcTemplateException
	 */
	private static void checkSqlStr(String sql) throws JdbcTemplateException {
		if (StringUtil.isEmpty(sql)) {
			throw new JdbcTemplateException("sql语句不能为空!");
		}
	}
}
