package com.chaoxing.gsd.modules.entity;

/**
 * @author heyang
 * @date 2018/08/31 describe:
 */
public class Gis {

	private String province;
	
	private String city;
	
	private String lon;
	
	private String lat;
	
	private Integer summary;

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getLon() {
		return lon;
	}

	public void setLon(String lon) {
		this.lon = lon;
	}

	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public Integer getSummary() {
		return summary;
	}

	public void setSummary(Integer summary) {
		this.summary = summary;
	}

	@Override
	public String toString() {
		return "Gis{" + "province='" + province + '\'' + ", city='" + city + '\'' + ", lon='" + lon + '\'' + ", lat='"
				+ lat + '\'' + ", summary=" + summary + '}';
	}
}
