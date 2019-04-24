package com.chaoxing.gsd.modules.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.UserFileDetail;
@Service
public interface UserFileDetailMapper {
	
    int deleteByPrimaryKey(Integer fileid);

    int insert(UserFileDetail record);

    int insertSelective(UserFileDetail record);

    UserFileDetail selectByPrimaryKey(Integer fileid);

    int updateByPrimaryKeySelective(UserFileDetail record);

    int updateByPrimaryKey(UserFileDetail record);
    
    List<UserFileDetail> getFilesByName(Map<String, Object> para);
    
    List<UserFileDetail> compoundQuery(Map<String, Object> para);
    
    UserFileDetail compoundQueryTotal(Map<String, Object> para);
    
    List<UserFileDetail> selectByFileSize(Map<String, Object> para);
    
    List<UserFileDetail> getFilesByType(Map<String, Object> para);
    
    List<UserFileDetail> getFilesOfLatestUp(Map<String, Object> para);
    
    List<UserFileDetail> getFilesOfLatestMod(Map<String, Object> para);
    
    UserFileDetail getFilesByNameTotal(Map<String, Object> para);
    
    UserFileDetail getFilesByTypeTotal(Map<String, Object> para);
    
    UserFileDetail getFilesOfLatestUpTotal(Map<String, Object> para);
    
    int checkFileName(UserFileDetail record);
}