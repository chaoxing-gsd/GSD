package com.chaoxing.gsd.modules.mapper;

import com.chaoxing.gsd.modules.entity.UserLeavingMessage;

public interface UserLeavingMessageMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(UserLeavingMessage record);

    int insertSelective(UserLeavingMessage record);

    UserLeavingMessage selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UserLeavingMessage record);

    int updateByPrimaryKey(UserLeavingMessage record);
}