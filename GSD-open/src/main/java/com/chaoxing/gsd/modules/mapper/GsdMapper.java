package com.chaoxing.gsd.modules.mapper;


import com.chaoxing.gsd.modules.entity.Gsd;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface GsdMapper {

   void insertGsd(Gsd gsd);

   void delGsd(Gsd gsd);

   List<String> getCategoryid2(Gsd gsd);

   List<Gsd> getGsd(Gsd gsd);

   List<Gsd> getSpecailGsd(Map<String, Object> para);
}
