package com.chaoxing.gsd.modules.mapper;

import com.chaoxing.gsd.modules.entity.GsdLib;

import java.util.HashSet;
import java.util.List;

public interface GsdLibMapper {
    int deleteByPrimaryKey(String libid);

    int insert(GsdLib record);

    int insertSelective(GsdLib record);

    GsdLib selectByPrimaryKey(String libid);

    int updateByPrimaryKeySelective(GsdLib record);

    int updateByPrimaryKey(GsdLib record);

    List<GsdLib> getAllLib(String selfcategoryname);


    GsdLib getGsdLibByLibId(String libId);

    HashSet<String> getSelfcategorynames();

    List<String> getSanfangIndexNames();
}