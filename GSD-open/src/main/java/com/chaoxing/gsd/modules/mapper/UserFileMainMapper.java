package com.chaoxing.gsd.modules.mapper;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.UserFileMain;
@Service
public interface UserFileMainMapper {
    int insert(UserFileMain record);

    int insertSelective(UserFileMain record);
    
    int deleteByPrimaryKey(UserFileMain record);
}