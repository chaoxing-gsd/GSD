package com.chaoxing.gsd.modules.entity;

import java.util.Date;
/**
 * 对应表literature_comp_show_set
 * @author winsl
 *
 */
public class LiteratureCompShowSet {
    private Integer labelid;

    private String filedsnamecn;

    private String filedids;

    private Date updatetime;

    private Date createtime;
    
    private String version;

    public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
    public Integer getLabelid() {
        return labelid;
    }

    public void setLabelid(Integer labelid) {
        this.labelid = labelid;
    }

    public String getFiledsnamecn() {
        return filedsnamecn;
    }

    public void setFiledsnamecn(String filedsnamecn) {
        this.filedsnamecn = filedsnamecn == null ? null : filedsnamecn.trim();
    }

    public String getFiledids() {
        return filedids;
    }

    public void setFiledids(String filedids) {
        this.filedids = filedids == null ? null : filedids.trim();
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