package com.chaoxing.gsd.web;

import com.chaoxing.gsd.bean.SearchArgumentBean;
import com.chaoxing.gsd.modules.service.RsService;
import com.chaoxing.gsd.service.EsService;
import com.chaoxing.gsd.web.res.BaseRes;
import com.chaoxing.gsd.web.res.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.POST;
import java.util.List;

@RequestMapping("/gsd/es")
@RestController
public class EsController {

	private static Logger logger = LoggerFactory.getLogger(EsController.class);

	@Autowired
	private EsService esService;

	@Autowired
	private RsService rsService;

	/**
	 * @author heyang
	 * @param ${indexName}
	 *            索引名称
	 * @param ${firstGroup}
	 *            一级分类 describe: 桶嵌套
	 */
	@POST
	@RequestMapping("/searchclusters3")
	public BaseResponse searchClusters3(@RequestParam(value = "indexName") String indexName,
			@RequestParam(value = "content") String content, @RequestParam(value = "firstGroup") String firstGroup,
			SearchArgumentBean searchArgumentBean) {
		BaseResponse rsp = new BaseResponse();
		try {
			List<String> sanfangIndexNames = rsService.getSanfangIndexNames();
			if (sanfangIndexNames.contains(indexName)) {
				rsp.setData(esService.searchClusters(indexName, searchArgumentBean.getField(), content, firstGroup,
						searchArgumentBean.getSecondGroup(), searchArgumentBean.getThirdGroup()));
				rsp.setStatu(true);
			} else {
				rsp.setStatu(false);
				rsp.setMsg("不存在的索引");
			}

		} catch (Exception e) {
			logger.error("searchClusters3 error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;

	}

	/**
	 * @author heyang
	 * @param ${indexName}
	 *            索引名称
	 * @param ${firstGroup}
	 *            一级分类 describe: 桶嵌套扁平化数据版本
	 */
	@POST
	@RequestMapping("/searchclusters4")
	public BaseResponse searchClusters4(@RequestParam(value = "indexName") String indexName,
			@RequestParam(value = "content") String content, @RequestParam(value = "firstGroup") String firstGroup,
			@RequestParam(value = "secondGroup") String secondGroup,
			@RequestParam(value = "thirdGroup") String thirdGroup) {
		BaseResponse rsp = new BaseResponse();
		try {
			List<String> sanfangIndexNames = rsService.getSanfangIndexNames();

			if (sanfangIndexNames.contains(indexName)) {
				rsp.setData(esService.searchClusters2(indexName, content, firstGroup, secondGroup, thirdGroup));
				rsp.setStatu(true);
			} else {
				rsp.setStatu(false);
				rsp.setMsg("不存在的索引");
			}

		} catch (Exception e) {
			logger.error("searchClusters3 error happend: {}", e);
			rsp = BaseRes.getErrorResponse();
		}
		return rsp;

	}
}
