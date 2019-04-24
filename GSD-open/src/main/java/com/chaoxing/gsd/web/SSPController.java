package com.chaoxing.gsd.web;

import com.alibaba.fastjson.JSON;
import com.chaoxing.gsd.modules.service.RsService;
import com.chaoxing.gsd.service.DownloadIndexService;
import com.chaoxing.gsd.service.SearchESClusterService;
import com.chaoxing.gsd.service.SearchESIndexService;
import com.chaoxing.gsd.service.WebpageIndexService;
import com.chaoxing.gsd.utils.IDUtils;
import com.chaoxing.gsd.web.res.BaseRes;
import com.chaoxing.gsd.web.res.BaseResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import java.io.*;
import java.util.*;
import com.spreada.utils.chinese.*;
import com.chaoxing.gsd.modules.entity.Gis;

/**
 * @author heyang
 * @date 2018/08/27 describe:索引操作
 */
@Controller
@RequestMapping("/gsd")
public class SSPController {

	@Autowired
	private SearchESIndexService esService;

	@Autowired
	private RsService rsService;

	@Autowired
	private DownloadIndexService downloadIndexService;

	@Autowired
	private SearchESClusterService sec;

	@Autowired
	private WebpageIndexService webpageis;

	// 文献message_types字段限制条件：BK=图书，JN=期刊，DT=学位论文，CP=会议论文，PAT=专利，ST=标准，NP=报纸，TR=科技成果，年鉴=YB,法律法规=LAR,信息咨询=INF,案例=CAS
	@SuppressWarnings("unused")
	private static String[] message_types = { "BK", "DT", "JN", "CP", "PAT", "ST", "NP", "TR", "YB", "LAR", "INF",
			"CAS" };

	// 用户保存网页document_type文档类型限制：webpage：邮件采集网页，literature文献
	public static final List<String> DOCUMENT_TYPES = Arrays.asList(new String[] { "webpage", "literature" });

	public static Logger logger = LoggerFactory.getLogger(SSPController.class);

	/**
	 * @author heyang
	 * @param ${indexnames}
	 *            索引数组
	 * @param ${content}
	 *            搜索内容
	 * @param ${field}
	 *            检索字段
	 * @param ${pagesize}
	 *            每页记录数
	 * @param ${pagenum}
	 *            第几页从0开始 describe: 在指定多个索引库检索内容
	 */
	@POST
	@RequestMapping("/search2")
	@ResponseBody
	public BaseResponse search2(@RequestParam(value = "indexnames") String[] indexNames,
			@RequestParam(value = "content") String content, @RequestParam(value = "field") String field,
			@RequestParam(value = "pagesize") Integer pageSize, @RequestParam(value = "pagenum") Integer pageNum) {
		long begin1 = System.currentTimeMillis();

		// 将内容转成简体
		String trueSearch = content == null ? content : 简繁转换类.转换(content, 简繁转换类.目标.简体);
		BaseResponse resp = new BaseResponse();
		Map<String, Object> map = esService.search2(indexNames, trueSearch, field, pageSize, pageNum);
		resp.setStatu(true);
		resp.setData(map);
		logger.info("search2 from es index: {} toast time：{} ", JSON.toJSONString(indexNames),
				System.currentTimeMillis() - begin1);
		return resp;
	}

	/**
	 * 在（七个哈佛库/7个索引）指定多个索引库查找聚类（String[] indexnames，String content,String field)
	 * 参数说明：indexnames索引库数组：textref_zhonghuajingdian,textref_kanripo,textref_ctext,textref_cbta,biogref_dnb,biogref_ddbc,biogref_cbdb
	 * content:搜索内容，field：检索字段，传空值，则在所有字段检索
	 * 返回的聚类名称包含:
	 * "gender","born_year","died_year","dynasty","jiguan","author","edition","collection","notes"
	 * @param indexNames
	 * @param content
	 * @param field
	 * @return
	 */
	@POST
	@RequestMapping("/searchclusters2")
	@ResponseBody
	public BaseResponse searchClusters2(@RequestParam(value = "indexnames", required = true) String[] indexNames,
			@RequestParam(value = "content", required = true) String content,
			@RequestParam(value = "field", required = true) String field) {
		long begin1 = System.currentTimeMillis();
		BaseResponse resp = new BaseResponse();
		Map<?, ?> map = sec.search2(indexNames, content, field);
		resp.setStatu(true);
		resp.setData(map);
		logger.info("searchclusters2 from es index: {} toast time：{} ", JSON.toJSONString(indexNames),
				System.currentTimeMillis() - begin1);
		return resp;
	}

	/**
	 * @author heyang
	 * @param ${indexName}索引名称
	 * @param ${indexId}
	 *            文档id describe: 根据索引名称和文档id查询文档
	 */
	@PostMapping("/es/searchindexbyid")
	@ResponseBody
	public BaseResponse searchDocumentById(@RequestParam(name = "indexName") String indexName,
			@RequestParam(name = "indexId") String documentId) {
		long begin1 = System.currentTimeMillis();
		BaseResponse resp = new BaseResponse();
		try {
			List<Map<String, Object>> result = esService.searchDocumentById(indexName, documentId);
			resp.setStatu(true);
			resp.setData(result);
		} catch (Exception e) {
			logger.info("searchindexbyid from es index: {} error：{} ", indexName, e);
			resp = BaseRes.getErrorResponse();
		}
		logger.info("searchindexbyid from es index: {} toast time：{} ", indexName, System.currentTimeMillis() - begin1);
		return resp;
	}

	/**
	 * @author heyang
	 * @param ${indexName}
	 *            索引名称 webpage
	 * @param ${documentIds}
	 *            文档id数组
	 * @param ${userId}
	 *            用户id describe:根据索引名称文档id数组删除文档
	 */
	@PostMapping("/es/deldocumentbyids")
	@ResponseBody
	public BaseResponse delDocumentById(@RequestParam(name = "indexName") String indexName,
			@RequestParam(name = "documentIds") String[] documentIds,
			@RequestParam(name = "userId", required = false) String userId) {
		long begin1 = System.currentTimeMillis();
		BaseResponse resp = new BaseResponse();
		try {
			for (String documentId : documentIds) {
				esService.delDocumentById(indexName, documentId);
			}
			resp.setStatu(true);
		} catch (Exception e) {
			logger.info("deldocumentbyids from es indexName: {} error：{} ", indexName, e);
			resp = BaseRes.getErrorResponse();
		}
		logger.info("deldocumentbyids from es indexName: {} toast time：{} ", indexName,
				System.currentTimeMillis() - begin1);
		return resp;
	}

	/**
	 * @author heyang
	 * @param webpageIds
	 *            网页id数组
	 * @param userId
	 *            用户id
	 * @param downloadType
	 *            导出格式:1(ris格式)/2(bib格式)只能输入1或者2 describe: 导出webpage索引
	 */
	@PostMapping("/es/downloadwebpage")
	@ResponseBody
	public void downLoadWebPage(@RequestParam(name = "webpageIds") String[] webpageIds,
			@RequestParam(name = "userId") String userId, @RequestParam(name = "downloadType") int downloadType,
			HttpServletResponse response, HttpServletRequest request) {
		try {
			if (downloadType != 1 && downloadType != 2) {
				logger.warn("downloadType只能输入1或者2");
				return;
			}
			List<Map<String, Object>> list = new ArrayList<>();
			// 查询所有网页
			for (String indexId : webpageIds) {
				List<Map<String, Object>> result = esService.searchDocumentById("webpage", indexId);
				if (result.size() != 0) {
					Map<String, Object> map = result.get(0);
					try {
						list.add(map);
					} catch (Exception e) {
						logger.error("downLoadWebPage error:{}", e);
					}
				}
			}

			String token = IDUtils.maketoken();
			String path = "";
			if (downloadType == 1) {
				path = "/" + token + ".ris";
			} else if (downloadType == 2) {
				path = "/" + token + ".bib";
			}
			String fileName = request.getServletContext().getRealPath(path);
			File file = new File(fileName);
			
			// 创建文件
			if (!file.exists()) {
				file.createNewFile();
			}
			
			// 写入，下载,删除
			if (downloadType == 1) {
				downloadIndexService.writeris(list, file);
			} else if (downloadType == 2) {
				downloadIndexService.writebib(list, file);
			}
			downLoad(response, fileName);
			file.delete();

			// 异步保存导出记录信息
			toSaveExportLiteratureRecord(userId, webpageIds);
		} catch (Exception e) {
			logger.error("downLoadWebPage error io:{}", e);
		}
	}

	/**
	 * 保存文献导出记录信息
	 * 
	 * @param userId
	 *            用户id
	 * @param literatureId
	 *            文献id
	 */
	@Async("asyncServiceExecutor")
	private void toSaveExportLiteratureRecord(String userId, String[] literatureId) {
		rsService.toSaveExportLiteratureRecord(userId, literatureId);
	}

	/**
	 * @author heyang
	 * @param path
	 *            文件路径 describe: 下载文本文件
	 */
	public void downLoad(HttpServletResponse response, String path) throws IOException {
		File file = new File(path);
		response.setContentType("text/html;charset=utf-8");
		FileReader reader = new FileReader(file);
		
		// 写出（字符缓冲流，只能写文字不能写图片）
		PrintWriter out = response.getWriter();
		char buffer[] = new char[1024];
		int len = 1024;
		while ((len = reader.read(buffer)) != -1) {
			out.write(buffer, 0, len);
		}
		
		// 释放资源
		reader.close();
		out.flush();
		out.close();
	}

	/**
	 * @author heyang
	 * @param ${indexName}
	 *            索引名称 sanfrancisco_picture describe: gis过滤
	 */
	@PostMapping("/es/gis")
	@ResponseBody
	public BaseResponse Gis(@RequestParam(name = "indexName") String indexName) {
		long begin1 = System.currentTimeMillis();
		BaseResponse resp = new BaseResponse();
		try {
			List<Gis> result = webpageis.Gis();
			resp.setStatu(true);
			resp.setData(result);
		} catch (Exception e) {
			logger.info("gis from es index: {} error：{} ", indexName, e);
			resp = BaseRes.getErrorResponse();
		}
		logger.info("gis from es index: {} toast time：{} ", indexName, System.currentTimeMillis() - begin1);
		return resp;
	}

}
