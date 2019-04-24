package com.chaoxing.esimportdata;

import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: longrui
 * @Date: 2018/4/28 11:06
 */
public class YAMlRead {

	private static Map<String, List<TableIndexMappingModel>> tabbleIndexMap = new HashMap<String, List<TableIndexMappingModel>>();

	public static Map<String, List<TableIndexMappingModel>> getTabbleIndexMap() {
		return tabbleIndexMap;
	}

	/**
	 * 通过指定文件名读取yaml配置文件
	 * 
	 * @param args
	 *            文件名数组
	 * @throws FileNotFoundException
	 */
	public static void readInfo(String[] args) throws FileNotFoundException {
		Yaml yaml = new Yaml();
		List<File> yamlFiles = new ArrayList<File>();
		String parentPath = YAMlRead.class.getResource("/dbConf").getPath();

		// 通过传参来读取具体的yaml文件
		File temp = null;
		if (null != args && args.length > 0) {
			for (String one : args) {
				temp = new File(parentPath.concat(File.separator).concat(one));
				yamlFiles.add(temp);
			}
		} else {
			System.err.println("error, yaml path is empty!!!");
		}

		for (File yamlFile : yamlFiles) {
			TableIndexMappingModel tableIndexMapping = (TableIndexMappingModel) yaml
					.loadAs(new FileInputStream(yamlFile), TableIndexMappingModel.class);
			List<TableIndexMappingModel> tableIndexMappingList = tableIndexMapping.getFieldList();
			tabbleIndexMap.put(yamlFile.getName().substring(0, yamlFile.getName().indexOf(".yaml")),
					tableIndexMappingList);
		}
	}

	/**
	 * 从当前工程路径里获取配置文件
	 * 
	 * @param args
	 * @throws FileNotFoundException
	 */
	public static void readInfo(String args) throws FileNotFoundException {
		Yaml yaml = new Yaml();

		String currentPath = System.getProperty("user.dir");
		System.out.println(currentPath);

		// 通过传参来读取具体的yaml文件
		File temp = new File(currentPath.concat(File.separator).concat(args));

		TableIndexMappingModel tableIndexMapping = (TableIndexMappingModel) yaml.loadAs(new FileInputStream(temp),
				TableIndexMappingModel.class);
		List<TableIndexMappingModel> tableIndexMappingList = tableIndexMapping.getFieldList();
		tabbleIndexMap.put(args.substring(0, args.indexOf(".yaml")), tableIndexMappingList);
	}
}
