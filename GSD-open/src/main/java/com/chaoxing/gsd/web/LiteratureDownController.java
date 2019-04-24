package com.chaoxing.gsd.web;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chaoxing.gsd.modules.entity.LiteratureDownDetail;
import com.chaoxing.gsd.modules.service.LiteratureDownService;
import com.chaoxing.gsd.web.res.BaseResponse;

/**
 * 文献下载入口
 * 
 * @author winsl
 *
 */
@Controller
@RequestMapping("/gsd")
public class LiteratureDownController {

	@Autowired
	private LiteratureDownService literatureDownService;

	@POST
	@RequestMapping("/createDownLabel")
	@ResponseBody
	public BaseResponse createLabel(@RequestParam(value = "userid", required = true) String userid,
			@RequestParam(value = "labelname", required = true) String labelname) {
		BaseResponse rsp = literatureDownService.createLabel(labelname, userid);
		return rsp;
	}

	@DELETE
	@RequestMapping("/deleteDownLabel")
	@ResponseBody
	public BaseResponse deleteLabel(@RequestParam(value = "labelid", required = true) Integer labelid) {
		BaseResponse rsp = literatureDownService.deleteLabel(labelid);
		return rsp;
	}

	@PUT
	@RequestMapping("/updateDownLabel")
	@ResponseBody
	public BaseResponse updateLabel(@RequestParam(value = "labelid", required = true) Integer labelid,
			@RequestParam(value = "labelname", required = true) String labelname) {
		BaseResponse rsp = literatureDownService.updateLabel(labelid, labelname);
		return rsp;
	}

	@GET
	@RequestMapping("/queryDownLabels")
	@ResponseBody
	public BaseResponse queryLabels(@RequestParam(value = "userid", required = true) String userid) {
		BaseResponse rsp = literatureDownService.queryLabels(userid);
		return rsp;
	}

	@POST
	@RequestMapping("/insertDownDetails")
	@ResponseBody
	public BaseResponse insertDetails(@RequestBody List<LiteratureDownDetail> data) {
		BaseResponse rsp = new BaseResponse();
		if (null != data) {
			rsp = literatureDownService.insertDetails(data);
		} else {
			rsp.setStatu(false);
			rsp.setMsg("your input parameter is wrong, please check!!!");
		}
		return rsp;
	}

	@DELETE
	@RequestMapping("/deleteDownDetails")
	@ResponseBody
	public BaseResponse deleteDetails(@RequestBody List<LiteratureDownDetail> data) {
		BaseResponse rsp = new BaseResponse();
		if (null != data) {
			rsp = literatureDownService.deleteDetails(data);
		} else {
			rsp.setStatu(false);
			rsp.setMsg("your input parameter is wrong, please check!!!");
		}
		return rsp;
	}

	@GET
	@RequestMapping("/queryDownDetails")
	@ResponseBody
	public BaseResponse queryDetails(@RequestParam(value = "labelid", required = true) Integer labelid) {
		BaseResponse rsp = literatureDownService.queryDetails(labelid);
		return rsp;
	}
}
