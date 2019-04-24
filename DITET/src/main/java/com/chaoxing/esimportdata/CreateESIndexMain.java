package com.chaoxing.esimportdata;

import com.alibaba.fastjson.JSON;
import com.opencsv.CSVParser;

import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.xcontent.XContentType;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 创建es索引
 * @author winsl
 *
 */
public class CreateESIndexMain {
	
	static List<String> csvFiles = new ArrayList<String>();
	
	static String CMD_ARG = null;
	
	public static final int COUNT_SPLIT = 500;
	
	private static String indexName;

	public static int error = 0;

	/**
	 * 执行main方法可以创建索引并插入数据
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			if (!init(args)) {
				addData2Index();
			} else {
				addData2IndexNew();
			}
		} catch (Exception e) {
			System.err.println("出错了，错误信息如下：");
			e.printStackTrace();
		}
		System.out.println("解析失败行数:" + error);
	}

	public static boolean init(String[] args) throws FileNotFoundException {

		// 如果参数中含有csv文件则走另外一种入库模式，流式读取原始数据文件，分批入库es
		boolean isNewWay = false;
		List<String> configFile = new ArrayList<String>();
		for (String one : args) {
			if (one.endsWith(".csv")) {
				isNewWay = true;
				csvFiles.add(one);
			} else if (one.endsWith(".yaml")) {
				configFile.add(one);
			} else {
				CMD_ARG = one;
			}
		}

		if (isNewWay) {
			if (configFile.size() != 1) {
				System.err.println("出错了，参数有问题！！！");
				System.exit(0);
			}

			YAMlRead.readInfo(configFile.get(0));
		} else {
			YAMlRead.readInfo(configFile.toArray(args));
		}
		return isNewWay;
	}

	public static <T> void addData2IndexNew() throws Exception {
		long startTime = System.currentTimeMillis();
		Map<String, List<TableIndexMappingModel>> listMap = YAMlRead.getTabbleIndexMap();
		String currentPath = System.getProperty("user.dir");
		System.out.println(currentPath);

		for (Map.Entry<String, List<TableIndexMappingModel>> entry : listMap.entrySet()) {
			indexName = entry.getKey();
			Class<?> modelClass = Class.forName("com.chaoxing.esimportdata.pojo.".concat(indexName));
			boolean indexIsExist = ESIndexFactory.isExists(indexName);
			if (!indexIsExist) {
				ESIndexFactory.createIndex(indexName);
			} else {
				if (!(CMD_ARG != null && CmdArgs.APPEND.getContent().equals(CMD_ARG))) {
					ESIndexFactory.deleteIndex(indexName);
					ESIndexFactory.createIndex(indexName);
				}
			}

			// 游标随机读取大文件，分批入es创建索引
			for (String one : csvFiles) {

				long[] pointe = new long[1];
				pointe[0] = 0l;
				List<String> keys = new ArrayList<String>();

				// 先读取第一行作为key,size是文件大小
				long size = randomKeys(currentPath.concat(File.separator).concat(one), pointe, keys);
				while (pointe[0] < size - 1) {
					
					// 再读取其它数据
					List<Map<String, String>> dataAll = randomRed(currentPath.concat(File.separator).concat(one),
							pointe, COUNT_SPLIT, keys);

					addBatchResult2Index(structureObject(dataAll, modelClass));
				}
			}
		}
		System.out.println("Total toast time is(seconds):" + (System.currentTimeMillis() - startTime) / 1000);
	}

	/**
	 * 读取第一行作为key
	 * 
	 * @param path
	 * @param pointe
	 * @param keys
	 * @return
	 */
	public static long randomKeys(String path, long[] pointe, List<String> keys) {
		long size = 0l;
		RandomAccessFile raf = null;
		try {
			/**
			 * model各个参数详解 r 代表以只读方式打开指定文件 rw 以读写方式打开指定文件 rws
			 * 读写方式打开，并对内容或元数据都同步写入底层存储设备 rwd 读写方式打开，对文件内容的更新同步更新至底层存储设备
			 * 
			 **/
			CSVParser pase = new CSVParser();
			raf = new RandomAccessFile(path, "r");
			
			// 移动文件指针位置
			raf.seek(pointe[0]);
			String temp = raf.readLine();
			String[] paseArray = null;
			paseArray = pase.parseLine(temp);
			for (int i = 0; i < paseArray.length; i++) {
				keys.add(paseArray[i]);
			}
			pointe[0] = raf.getFilePointer();
			size = raf.length();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (raf != null) {
				try {
					raf.close();
				} catch (IOException e) {
					System.err.println("close raf error!!!");
				}
			}
		}
		return size;
	}

	/**
	 * 读取csv文件中的数据内容
	 * 
	 * @param path
	 * @param pointe
	 * @param readLine
	 * @param keys
	 * @return
	 */
	public static List<Map<String, String>> randomRed(String path, long[] pointe, int readLine, List<String> keys) {
		List<Map<String, String>> out = new ArrayList<Map<String, String>>();
		RandomAccessFile raf = null;
		try {
			/**
			 * model各个参数详解 r 代表以只读方式打开指定文件 rw 以读写方式打开指定文件 rws
			 * 读写方式打开，并对内容或元数据都同步写入底层存储设备 rwd 读写方式打开，对文件内容的更新同步更新至底层存储设备
			 * 
			 **/
			CSVParser pase = new CSVParser();
			raf = new RandomAccessFile(path, "r");
			
			// 移动文件指针位置
			raf.seek(pointe[0]);
			int index = 0;
			String temp = raf.readLine(), yyy = null;
			Map<String, String> para = null;
			String[] paseArray = null;
			
			// 循环读取
			while (temp != null) {
				para = new HashMap<String, String>();
				yyy = new String(temp.getBytes("ISO-8859-1"), "gbk");
				try {
					paseArray = pase.parseLine(yyy);
					for (int i = 0; i < paseArray.length; i++) {
						
						// RandomAccessFile方式读取文件默认是ISO-8859-1，需要转下编码
						para.put(keys.get(i), paseArray[i]);// new String(paseArray[i].getBytes("ISO-8859-1"),"utf-8"));
					}
					out.add(para);
				} catch (Exception e) {
					error++;
				}

				index++;
				if (index == readLine) {
					pointe[0] = raf.getFilePointer();
					System.out.println("ponit break:" + pointe[0]);
					break;
				}
				temp = raf.readLine();
			}

			// 读取完后游标设置
			pointe[0] = raf.getFilePointer();
			System.out.println("ponit end:" + pointe[0]);
		} catch (Exception e) {
			e.printStackTrace();
			if (raf != null) {
				try {
					raf.close();
				} catch (IOException ee) {
					System.err.println("close raf error!!!");
				}
			}
			System.exit(0);
		} finally {
			System.out.println("exec..."); // 程序提前退出是不会执行的
			if (raf != null) {
				try {
					raf.close();
				} catch (IOException e) {
					System.err.println("close raf error!!!");
				}
			}
		}
		return out;
	}

	/**
	 * 将数据写入索引
	 * @throws Exception
	 */
	public static void addData2Index() throws Exception {
		Map<String, List<TableIndexMappingModel>> listMap = YAMlRead.getTabbleIndexMap();

		for (Map.Entry<String, List<TableIndexMappingModel>> entry : listMap.entrySet()) {
			indexName = entry.getKey();
			boolean indexIsExist = ESIndexFactory.isExists(indexName);
			if (!indexIsExist) {
				ESIndexFactory.createIndex(indexName);
			} else {
				if (!(CMD_ARG != null && CmdArgs.APPEND.getContent().equals(CMD_ARG))) {
					ESIndexFactory.deleteIndex(indexName);
					ESIndexFactory.createIndex(indexName);
				}
			}
			String countSql = "";
			StringBuilder resultSql = new StringBuilder();
			Class<?> modelClass = Class.forName("com.chaoxing.esimportdata.pojo.".concat(indexName));
			countSql = "select count(*) from " + entry.getKey();
			resultSql.append("select ");

			for (int i = 0; i < entry.getValue().size(); i++) {
				TableIndexMappingModel tableIndexMappingModel = entry.getValue().get(i);
				if (!StringUtil.isEmpty(tableIndexMappingModel.getTable_field_name())) {
					if (!StringUtil.isEmpty(tableIndexMappingModel.getIndex_field_name())) {
						resultSql.append(tableIndexMappingModel.getTable_field_name()).append(" ")
								.append(tableIndexMappingModel.getIndex_field_name());
						if (i != entry.getValue().size() - 1) {
							resultSql.append(",");
						}
					} else {
						resultSql.append(tableIndexMappingModel.getTable_field_name()).append(" ")
								.append(tableIndexMappingModel.getTable_field_name());
						if (i != entry.getValue().size() - 1) {
							resultSql.append(",");
						}
					}
				}
			}
			resultSql.append(" from ").append(entry.getKey()).append("  limit ?,?");
			createIndex(countSql, resultSql.toString(), modelClass);
		}
	}

	/**
	 * 创建索引
	 * 
	 * @param countSql
	 * @param resultSql
	 * @param modelClass
	 * @throws Exception
	 */
	private static <T> void createIndex(String countSql, String resultSql, Class<T> modelClass) throws Exception {
		long begin = System.currentTimeMillis();
		List<T> ssWareResourceInfoModelList = new ArrayList<T>();
		int count = JdbcTemplateUtil.queryCount(countSql, new Object[] {});
		System.out.println("一共" + count + "条记录");
		if (count <= COUNT_SPLIT) {
			ssWareResourceInfoModelList = JdbcTemplateUtil.queryList(resultSql, modelClass, 0, COUNT_SPLIT);
			addBatchResult2Index(ssWareResourceInfoModelList);
			System.out.println("已索引" + count + "条记录");
		} else {
			for (int i = 1; i <= count; i++) {
				if (i % COUNT_SPLIT == 0) {
					ssWareResourceInfoModelList = JdbcTemplateUtil.queryList(resultSql, modelClass,
							(i / COUNT_SPLIT - 1) * COUNT_SPLIT, COUNT_SPLIT);
					addBatchResult2Index(ssWareResourceInfoModelList);
					System.out.println("已索引" + COUNT_SPLIT + "条记录");
				}
			}

			// 不能整除则需要入库最后一次
			if (count % COUNT_SPLIT != 0) {
				int start = (count / COUNT_SPLIT) * COUNT_SPLIT;
				ssWareResourceInfoModelList = JdbcTemplateUtil.queryList(resultSql, modelClass, start, COUNT_SPLIT);
				addBatchResult2Index(ssWareResourceInfoModelList);
				System.out.println("已索引" + (count - start + 1) + "条记录");
			}
		}
		System.out.println("索引创建结束");
		System.out.println("一共耗时：" + (System.currentTimeMillis() - begin) / 1000 + "秒");
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
	public static <T> List<T> structureObject(List<Map<String, String>> data, Class<T> cls)
			throws JdbcTemplateException {
		List<T> allOut = new ArrayList<T>();
		for (Map<String, String> ttt : data) {
			// 反射获取字段属性信息，并将数据库查询值赋值
			T out = null;
			try {
				out = cls.newInstance();
			} catch (InstantiationException e) {
				System.err.println("InstantiationException error!!!");
				return allOut;
			} catch (IllegalAccessException e) {
				System.err.println("IllegalAccessException error!!!");
				return allOut;
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
						field.set(out, ttt.get(filedName));
					} else if (filedStr.endsWith("java.lang.Integer")) {
						field.set(out, Integer.parseInt(ttt.get(filedName)));
					} else if (filedStr.endsWith("java.util.Date")) {
						// field.set(out, ttt.get(filedName));// 时间会有问题
					} else if (filedStr.endsWith("java.lang.Long")) {
						field.set(out, Long.parseLong(ttt.get(filedName)));
					} else if (filedStr.endsWith("java.lang.Double")) {
						field.set(out, Double.parseDouble(ttt.get(filedName)));
					}
					/*
					 * if(filedStr.endsWith("java.lang.Character")) {
					 * field.set(out, rs.getCharacterStream(filedName)); }
					 */
					else if (filedStr.endsWith("java.lang.Boolean")) {
						// field.set(out, rs.getBoolean(filedName)); //
						// boolean会有问题
					} else {
						System.err.println("class " + cls.getClass().getName() + " have not right field!!!");
						System.err.println("filedStr is :" + filedStr);
					}
				} catch (IllegalArgumentException | IllegalAccessException e) {
					System.err.println("class " + filedName + " set field value error!!!");
				}
			}
			allOut.add(out);
		}

		return allOut;
	}

	/**
	 * 批处理添加记录到索引
	 * 
	 * @param ssWareResourceInfoModelList
	 * @throws IOException
	 */
	private static <T> void addBatchResult2Index(List<T> ssWareResourceInfoModelList) throws IOException {
		System.out.println(
				"查询得到：" + ssWareResourceInfoModelList == null ? 0 : ssWareResourceInfoModelList.size() + "条数据!!!");
		TransportClient client = ESIndexFactory.getClientInstance();
		BulkRequestBuilder bulkRequest = client.prepareBulk();
		for (T ssWareResourceInfoModel : ssWareResourceInfoModelList) {
			String jsonStr = JSON.toJSONString(ssWareResourceInfoModel);
			bulkRequest.add(
					client.prepareIndex(indexName, ESIndexFactory.INDEX_TYPE).setSource(jsonStr, XContentType.JSON));
		}
		BulkResponse resp = bulkRequest.get();
		System.out.println("xxx---xxxx:" + resp.buildFailureMessage());
	}

	/**
	 * 命令参数枚举
	 * @author winsl
	 *
	 */
	enum CmdArgs {
		APPEND("已有则在后面添加", "-a"), NEWLYBUILD("新建，原有则先删除再创建", "-n");

		private String release;

		private String content;

		CmdArgs(String release, String content) {
			this.release = release;
			this.content = content;
		}

		public String getContent() {
			return content;
		}

		public void setContent(String content) {
			this.content = content;
		}

		public void showMsg() {
			System.out.println(release);
		}
	}
}
