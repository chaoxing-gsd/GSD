package com.chaoxing.gsd.modules.mapper;

import com.chaoxing.gsd.modules.entity.Users;
import com.chaoxing.gsd.modules.entity.UsersExample;
import java.util.List;

public interface UsersMapper {
    long countByExample(UsersExample example);
    
    List<Users> checkUserInfo(Users example);

    int deleteByPrimaryKey(Integer id);

    int insert(Users record);

    int insertSelective(Users record);

    List<Users> selectByExample(UsersExample example);

    Users selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Users record);

    int updateByPrimaryKey(Users record);
}