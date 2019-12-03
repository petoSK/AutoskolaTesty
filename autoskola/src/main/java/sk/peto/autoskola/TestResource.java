package sk.peto.autoskola;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("resources")
public class TestResource {
	
	TestRepo tr=new TestRepo();
	

	@Path("test")
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})   //{MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML}
	public List<Test> vypisTest(){
	return tr.getTesty();
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
	
	
	
	

	
}
