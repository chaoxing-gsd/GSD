package com.chaoxing.gsd.modules.mapper;


import com.chaoxing.gsd.modules.entity.GsdUser2;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface GsdUser2Mapper {

   void open(String  userid);

   void close(String  userid);

   GsdUser2 find(String userid);

   void insert(GsdUser2 user);

   void openShareWebpage(String  userid);

   void closeShareWebpage(String  userid);

    List<GsdUser2> findShareWebpageUsers();
}
