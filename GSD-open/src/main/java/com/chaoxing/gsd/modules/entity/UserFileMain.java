package com.chaoxing.gsd.modules.entity;
/**
 * 对应表user_file_main
 * @author winsl
 *
 */
public class UserFileMain {
    private String userid;

    private Integer fileid;

    private String extend;

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid == null ? null : userid.trim();
    }

    public Integer getFileid() {
        return fileid;
    }

    public void setFileid(Integer fileid) {
        this.fileid = fileid;
    }

    public String getExtend() {
        return extend;
    }

    public void setExtend(String extend) {
        this.extend = extend == null ? null : extend.trim();
    }
}