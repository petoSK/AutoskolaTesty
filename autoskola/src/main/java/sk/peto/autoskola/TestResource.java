package sk.peto.autoskola;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

@Path("resources")
public class TestResource {
	
	TestRepo tr=new TestRepo();
	

	@Path("test")
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})   //{MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML}
	public List<Test> vypisTest(){
	return tr.getTesty();
	}
	
	
	@Path("userLogin")
	@POST
	@Consumes(MediaType.TEXT_PLAIN)//MediaType.TEXT_PLAIN
	@Produces(MediaType.APPLICATION_JSON)
	public   Response getUsername( String user) {
		System.out.println("user: "+user);
		return Response.ok().cookie(new NewCookie("user", user,"/","","comment...",60*60,false)).build(); //.entity(user)	
	}
	@Path("userLogout")
	@GET
	@Consumes(MediaType.TEXT_PLAIN)//MediaType.TEXT_PLAIN
	@Produces(MediaType.APPLICATION_JSON)
	public   Response userLogout(@Context HttpHeaders headers) {
	//	System.out.println("user logout: "+user);
		Map<String, Object> cookieMap = new HashMap<String, Object>();
		 
		for (String key : headers.getCookies().keySet()) {
			Cookie cookie = headers.getCookies().get(key);	
			System.out.println("read cookie--- "+cookie.getName()+":"+cookie.getValue());
			
			cookieMap.put(key, cookie.getValue());
		
		}
		
		
		return Response.ok().cookie(new NewCookie("user", "","/","","comment...",0,false)).build();
	}
	 
	
	@GET
	@Path("/listCookies")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCookieList(@Context HttpHeaders headers) {
	 System.out.println("getCookieList");
		Map<String, Object> cookieMap = new HashMap<String, Object>();
	 
		for (String key : headers.getCookies().keySet()) {
			Cookie cookie = headers.getCookies().get(key);	
			System.out.println("read cookie--- "+cookie.getName()+":"+cookie.getValue());
		
			cookieMap.put(key, cookie.getValue());
		
		}
		System.out.println("number of cookies found: "+cookieMap.size());
		return Response.status(200).entity(cookieMap).build();
	 
	}
	
	@Path("q")
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public List<Test> vypisOtazku(){
	return tr.getOtazka();
	}
	
	@Path("users")
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public List<User> listUsers(){	
	return tr.getUser();	
	}
	
	@Path("createTest")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public void createTest() {
		tr.createTest();
	}
	
	@Path("getTest")
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public ArrayList<Test> getTest(int testNumber) {
		
		return tr.getTestfromDb(testNumber);
	}
	
	@Path("saveResult")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public void saveTestResult(TestResult res) {
		System.out.println("saveTestResult");
		tr.saveResulttoDb(res);
	}
	
	@Path("getQuestion")
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Otazka getQuestion(int i) {
		
		return tr.getOtazka(i);
		
	}
	
}
