package com.chaoxing.gsd.modules.mapper;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.LiteratureDetail;

@Service
public interface LiteratureDetailMapper {
    int deleteByPrimaryKey(String literatureid);

    int insert(LiteratureDetail record);

    int insertSelective(LiteratureDetail record);

    LiteratureDetail selectByPrimaryKey(String literatureid);

    int updateByPrimaryKeySelective(LiteratureDetail record);

    int updateByPrimaryKeyWithBLOBs(LiteratureDetail record);

    int updateByPrimaryKey(LiteratureDetail record);
}