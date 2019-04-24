package com.chaoxing.gsd.core.utils;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.sun.mail.imap.IMAPFolder;

/**
 * 邮件工具类
 * 
 * @author winsl
 *
 */
@Component
public class MailUtil {

	private static final Logger logger = LoggerFactory.getLogger(MailUtil.class);

	/**
	 * 邮件回复
	 * @param properties 配置
	 * @param message 提示信息 "此邮件为系统自动发送\n\n\n\n\n<img src='cid:a'>", "text/html;charset=gb2312"
	 * @param mailTitle 邮件标题
	 * @param mailFrom 邮件发送者
	 * @param mailTo 邮件接收者
	 * @param mailTo 抄送
	 */
	public static void sendEmail(Properties properties, String msg, String meta, String mailTitle, String mailFrom, List<String> mailTo, List<String> mailCc)
	{
		if(null == mailTo || mailTo.size() == 0)
		{
			logger.warn("send mail but to mail is empty!!!");
			return;
		}
		Session session = Session.getInstance(properties);
		Transport t = null;
		try {
			Address[] toWho = null, cCWho = null; 
			toWho = new Address[mailTo.size()];
			int index = 0;
			for(String one : mailTo)
			{
				toWho[index] = new InternetAddress(one);
				index++;
			}
			
			if(null != mailCc && mailCc.size() > 0)
			{
				index = 0;
				cCWho = new Address[mailCc.size()];
				for(String one : mailCc)
				{
					cCWho[index] = new InternetAddress(one);
					index++;
				}	
			}
			
			Message replyMessage = new MimeMessage(session);
			replyMessage.setFrom(new InternetAddress(mailFrom));


			MimeBodyPart text = new MimeBodyPart();
			text.setContent(msg, meta);

			MimeMultipart mm = new MimeMultipart();
			mm.addBodyPart(text);

			mm.setSubType("related");

			replyMessage.setContent(mm);

			replyMessage.saveChanges();

			replyMessage.setSubject(mailTitle);
			
			replyMessage.setRecipients(Message.RecipientType.TO, toWho);
			
			if(cCWho != null)
			{
				replyMessage.setRecipients(Message.RecipientType.CC, cCWho);
			}
			
			t = session.getTransport("smtp");
			t.connect(properties.getProperty("userName"), properties.getProperty("passWord"));
			t.sendMessage(replyMessage, replyMessage.getAllRecipients());
//			Transport.send(replyMessage);
			logger.debug("send email to {} successfully.", mailTo);
		} catch (Exception e) {
			logger.error("error happend at replyToEmail: {}", e);
		}
		finally
		{
			if(null != t)
			{
				try {
					t.close();
				} catch (MessagingException e) {
					logger.error("error happend at close mail transport: {}", e);
				}
			}
		}
	}

	/**
	 * 邮件回复
	 * @param properties 配置
	 * @param message 提示信息 "此邮件为系统自动发送\n\n\n\n\n<img src='cid:a'>", "text/html;charset=gb2312"
	 * @param picPath 图片路径
	 * @param mailIndex 回复邮件index
	 * @param mailTitle 邮件标题
	 */
	public static void replyToEmail(Properties properties, String msg, String meta, String[] picPath, int mailIndex, String mailTitle)
	{
		Session session = Session.getInstance(properties);
		Store store = null;
		Folder folder = null;
		try {

			// 创建IMAP协议的Store对象
			store = session.getStore("imap");

			// 连接邮件服务器
			store.connect(properties.getProperty("mail.imap.host"), properties.getProperty("userName"), properties.getProperty("passWord"));

			// 获得收件箱
			folder = (IMAPFolder) store.getFolder("INBOX");
			folder.open(Folder.READ_ONLY);


			Message[] messages = folder.getMessages();
			if (messages != null && messages.length > 0 && mailIndex <= messages.length) {

				Message message = messages[mailIndex];
				// Get all the information from the message
				String from = InternetAddress.toString(message.getFrom());
				if (from != null) {
					logger.info("From: {}", from);
				}

				String replyTo = InternetAddress.toString(message.getReplyTo());
				if (replyTo != null) {
					logger.info("Reply-to: {}", replyTo);
				}
				String to = InternetAddress.toString(message.getRecipients(Message.RecipientType.TO));
				if (to != null) {
					logger.info("To: {}", to);
				}

				String subject = message.getSubject();
				if (subject != null) {
					logger.info("Subject: {}", subject);
				}
				Date sent = message.getSentDate();
				if (sent != null) {
					logger.info("Sent date: {}", sent);
				}


				Message replyMessage = new MimeMessage(session);
				replyMessage = (MimeMessage) message.reply(false);
				replyMessage.setFrom(new InternetAddress(to));
				
				if(null != picPath)
				{
					// 设置图片
					MimeBodyPart text = new MimeBodyPart();
					text.setContent(msg, meta);
					
					MimeBodyPart img = new MimeBodyPart();

					// 图片路径
					DataHandler dh = new DataHandler(new FileDataSource(picPath[0]));
					img.setDataHandler(dh);
					img.setContentID("a");


					MimeBodyPart img2 = new MimeBodyPart(); 
					//第二张图片路径
					DataHandler dh2 = new DataHandler(new FileDataSource(picPath[1]));
					img2.setDataHandler(dh2); 
					img2.setContentID("b");


					MimeMultipart mm = new MimeMultipart();
					mm.addBodyPart(text);
					mm.addBodyPart(img);
					// 设置正文与图片之间的关系
					mm.setSubType("related");

					// 图班与正文的 body
					MimeBodyPart all = new MimeBodyPart();
					all.setContent(mm);
					MimeMultipart mm2 = new MimeMultipart();
					mm2.addBodyPart(all);
					mm2.addBodyPart(img2);
					mm2.setSubType("mixed");

					replyMessage.setContent(mm2);
				}
				else
				{
					MimeBodyPart text = new MimeBodyPart();
					text.setContent(msg, meta);
					
					MimeMultipart mm = new MimeMultipart();
					mm.addBodyPart(text);
					
					mm.setSubType("related");

					/*MimeBodyPart all = new MimeBodyPart();
					all.setContent(mm);
					MimeMultipart mm2 = new MimeMultipart();
					mm2.addBodyPart(all);
					mm2.setSubType("mixed");*/

					replyMessage.setContent(mm);
				}

				replyMessage.saveChanges();

				replyMessage.setReplyTo(message.getReplyTo());
				replyMessage.setSubject(mailTitle);

				Transport t = session.getTransport("smtp");
				try {
					t.connect(properties.getProperty("userName"), properties.getProperty("passWord"));
					t.sendMessage(replyMessage, replyMessage.getAllRecipients());
				} finally {
					t.close();
				}
				logger.info("message replied successfully ....");

			}
			else
			{
				// 有异常
				logger.warn("system is not right at replyToEmail!!!");
			}

		} catch (Exception e) {
			logger.error("error happend at replyToEmail: {}", e);
		}
		finally
		{
			try {
				folder.close(false);
				store.close();
			} catch (MessagingException e) {
				logger.error("error happend at replyToEmail to close stream: {}", e);
			}
		}
	}

	/**
	 * 文件重命名
	 * @param inputName
	 * @return
	 */
	public static String sanitizeFilename(String inputName) {
	    return inputName.replaceAll("[^a-zA-Z0-9-_\\.]", "_");
	  }
	
	/**
	 * 绕过验证
	 * 
	 * @return
	 * @throws NoSuchAlgorithmException
	 * @throws KeyManagementException
	 */
	public static SSLContext createIgnoreVerifySSL() throws NoSuchAlgorithmException, KeyManagementException {
		SSLContext sc = SSLContext.getInstance("SSLv3");

		// 实现一个X509TrustManager接口，用于绕过验证，不用修改里面的方法
		X509TrustManager trustManager = new X509TrustManager() {
			@Override
			public void checkClientTrusted(java.security.cert.X509Certificate[] paramArrayOfX509Certificate,
					String paramString) throws CertificateException {
			}

			@Override
			public void checkServerTrusted(java.security.cert.X509Certificate[] paramArrayOfX509Certificate,
					String paramString) throws CertificateException {
			}

			@Override
			public java.security.cert.X509Certificate[] getAcceptedIssuers() {
				return null;
			}
		};

		sc.init(null, new TrustManager[] { trustManager }, null);
		return sc;
	}
}
