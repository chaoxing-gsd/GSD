package com.chaoxing.gsd.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.mapper.Biogref_DnbMapper;

import com.chaoxing.gsd.modules.entity.Gis;

import java.util.*;

/**
 * @author heyang
 * @date 2018/08/27 describe:webage索引操作业务层
 */
@Service
public class WebpageIndexService {
	
	private static Logger logger = LoggerFactory.getLogger(WebpageIndexService.class);

	@Autowired
	private Biogref_DnbMapper biogref_DnbMapper;

	public List<com.chaoxing.gsd.modules.entity.Gis> Gis() {
		logger.info("Enter into method Gis.");
		Set<String> shengfens = biogref_DnbMapper.selectShengfen();
		List<Gis> biogref_dnb_gis = new ArrayList<>();
		for (String shengfen : shengfens) {
			if (shengfen != null && !"".equals(shengfen)) {
				Set<String> shiqus = biogref_DnbMapper.selectShiqu(shengfen);
				for (String shiqu : shiqus) {
					if (shiqu != null && !"".equals(shiqu)) {
						Gis gis = new Gis();
						gis.setProvince(shengfen);
						gis.setCity(shiqu);
						Integer summary = biogref_DnbMapper.selectCountByGis(gis);
						gis.setSummary(summary);
						biogref_dnb_gis.add(gis);
					}
				}
			}
		}
		return biogref_dnb_gis;

	}

}
