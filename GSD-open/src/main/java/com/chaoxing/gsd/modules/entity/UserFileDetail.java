package com.chaoxing.gsd.modules.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
/**
 * 对应表user_file_detail
 * @author winsl
 *
 */
public class UserFileDetail {
	
	private String userid;
	
	private String extend;
	
    private Integer fileid;

    private String filetype;

    private String filesmallclass;

    private String filename;
    
    private Long filesize;

    private String fileurl;

    private String objectid;

    private String filefrom;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") 
    private Date updatetime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createtime;

    public Long getFilesize() {
		return filesize;
	}

	public void setFilesize(Long filesize) {
		this.filesize = filesize;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public Integer getFileid() {
        return fileid;
    }

    public void setFileid(Integer fileid) {
        this.fileid = fileid;
    }

    public String getFiletype() {
        return filetype;
    }

    public void setFiletype(String filetype) {
        this.filetype = filetype == null ? null : filetype.trim();
    }

    public String getFilesmallclass() {
        return filesmallclass;
    }

    public void setFilesmallclass(String filesmallclass) {
        this.filesmallclass = filesmallclass == null ? null : filesmallclass.trim();
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename == null ? null : filename.trim();
    }

    public String getFileurl() {
        return fileurl;
    }

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl == null ? null : fileurl.trim();
    }

    public String getObjectid() {
        return objectid;
    }

    public void setObjectid(String objectid) {
        this.objectid = objectid == null ? null : objectid.trim();
    }

    public String getFilefrom() {
        return filefrom;
    }

    public void setFilefrom(String filefrom) {
        this.filefrom = filefrom == null ? null : filefrom.trim();
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }
}