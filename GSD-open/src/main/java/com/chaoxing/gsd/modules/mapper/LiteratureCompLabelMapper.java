package com.chaoxing.gsd.modules.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.LiteratureCompLabel;
@Service
public interface LiteratureCompLabelMapper {
	
	LiteratureCompLabel getIdByUseridName(Map<String, Object> para);
	
	LiteratureCompLabel getCount(Map<String, Object> para);
	
    int deleteByPrimaryKey(Integer id);

    int insert(LiteratureCompLabel record);

    int insertSelective(LiteratureCompLabel record);

    List<LiteratureCompLabel> selectByUserId(Map<String, Object> para);

    int updateByPrimaryKeySelective(LiteratureCompLabel record);

    int updateByPrimaryKey(LiteratureCompLabel record);
    
    LiteratureCompLabel getVersionById(Integer id);
}