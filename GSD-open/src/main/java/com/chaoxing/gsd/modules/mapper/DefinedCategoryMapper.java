package com.chaoxing.gsd.modules.mapper;


import com.chaoxing.gsd.modules.entity.DefinedCategory;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

//@Mapper
@Service
public interface DefinedCategoryMapper {


   List<DefinedCategory> getCategoryByUserid(@Param("userid") String userid);

   void insertCategory(DefinedCategory category);

   void delCategory(DefinedCategory category);

   List<String> getCategoryIdsByUserid(String userid);
   
   List<DefinedCategory> getLastFiveCategory(String userid);
   
   List<DefinedCategory> getLastestFiveCategory(String userid);

   DefinedCategory getCategoryByUseridAndName(DefinedCategory category);

   void changeCategoryName(DefinedCategory category);

   int updateOperatTime(DefinedCategory category);

}
