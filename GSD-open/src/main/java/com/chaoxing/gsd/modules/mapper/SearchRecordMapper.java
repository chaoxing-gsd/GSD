package com.chaoxing.gsd.modules.mapper;

import com.chaoxing.gsd.modules.entity.SearchRecord;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface SearchRecordMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(SearchRecord record);

    int insertSelective(SearchRecord record);

    SearchRecord selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(SearchRecord record);

    int updateByPrimaryKey(SearchRecord record);



    void delSearchRecordByUserId(String userid);

    void delSearchRecordByContent(SearchRecord searchRecord);

	List<SearchRecord> getSearchCountRanking(Map<String, Object> para);

	List<SearchRecord> getGsdVisitAmount(Map<String, Object> para);

    Set<String> getAddress();

    List<String> getPointByAddress(String address);

    Integer getCountByAddress(String address);
    
    void deleteSearchHistory(Map<String, Object> para);

    List<SearchRecord> get24HoursSearchRecord(SearchRecord searchRecord);

    List<SearchRecord>  getLastWeekSearchRecord(SearchRecord searchRecord);

    List<SearchRecord>  getLastMonthSearchRecord(SearchRecord searchRecord);

    List<SearchRecord> getMoreSearchRecord(SearchRecord searchRecord);
    
    List<SearchRecord> get24HoursSearchRecordNum(SearchRecord searchRecord);

    List<SearchRecord> getLastWeekSearchRecordNum(SearchRecord searchRecord);

    List<SearchRecord> getLastMonthSearchRecordNum(SearchRecord searchRecord);

    List<SearchRecord> getMoreSearchRecordNum(SearchRecord searchRecord);
    
}