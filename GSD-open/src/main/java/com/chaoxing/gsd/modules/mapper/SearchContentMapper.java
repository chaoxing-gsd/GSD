package com.chaoxing.gsd.modules.mapper;


import com.chaoxing.gsd.modules.entity.SearchContent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public interface SearchContentMapper {

    void insertSearchContent(SearchContent searchRecord);

    List<SearchContent> getTodaySearchContent(String userid);

    List<SearchContent> getLastWeekSearchContent(String userid);

    List<SearchContent> getLastMounthSearchContent(String userid);

    List<SearchContent> getMoreSearchContent(String userid);

    List<SearchContent> getSearchContentByContent(SearchContent searchRecord);

    void delAllContent(String userid);

    void delContent(SearchContent s);

    Integer getTodaySearchCount(SearchContent s);

    Integer getLastWeekSearchCount(SearchContent content);

    Integer getLastMounthSearchCount(SearchContent content);

    Integer getMoreSearchCount(SearchContent content);

	int getSearchCount(String userId);
	
	List<SearchContent> getCountOfSearch(Map<String, Object> para);
	
	SearchContent getWeekIncreaseOfSearch(Map<String, Object> para);
	
	void deleteSearchHistory(Map<String, Object> para);
}
