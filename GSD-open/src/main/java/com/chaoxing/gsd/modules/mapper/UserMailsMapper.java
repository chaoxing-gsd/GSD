package com.chaoxing.gsd.modules.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chaoxing.gsd.modules.entity.UserMails;

@Service
public interface UserMailsMapper {

	void insertUserMail(UserMails bean);
	
	List<UserMails> getUserMails(String userid);
	
	UserMails getUserByMail(String mail);
	
	void deleteMail(UserMails bean);
}
