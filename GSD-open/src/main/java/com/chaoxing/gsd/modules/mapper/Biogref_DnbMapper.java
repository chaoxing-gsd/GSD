package com.chaoxing.gsd.modules.mapper;


import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.Biogref_Dnb;
import com.chaoxing.gsd.modules.entity.Gis;

import java.util.Set;

@Service
public interface Biogref_DnbMapper {
    int insert(Biogref_Dnb record);

    int insertSelective(Biogref_Dnb record);

    Set<String> selectShengfen();

    Set<String> selectShiqu(String shengfen);

    Integer selectCountByGis(Gis gis);
}