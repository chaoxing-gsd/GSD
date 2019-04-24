package com.chaoxing.gsd.modules.mapper;

import com.chaoxing.gsd.modules.entity.GsdIndex;

import java.util.List;

public interface GsdIndexMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(GsdIndex record);

    int insertSelective(GsdIndex record);

    GsdIndex selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(GsdIndex record);

    int updateByPrimaryKey(GsdIndex record);

    List<GsdIndex> SelectUserIndex(String userId);

    List<GsdIndex> SelectAllIndex();
}