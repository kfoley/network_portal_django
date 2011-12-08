
function wedge_plot(div) {
    var width=1200, height=1200;
    var	cnv_ring_height = 60;

      var tick_keys = ['METH','CNV','hsa-miR','Other'],
        color_scale = pv.Scale.ordinal(tick_keys).range(pv.Colors.category10().range().slice(0,tick_keys.length));

    var tick_colors = function(data) {
           var tick_key = 'Other';
           tick_keys.forEach(function(key){
           if (data.label.indexOf(key) == 0)  //starts with key
           tick_key = key;
           });
       return color_scale(tick_key);
       };


    var data = {
   PLOT: {
            container: div,
            width : width,
            height: height,
            vertical_padding : 40,
            horizontal_padding: 40,
            enable_pan : false,
            enable_zoom : false,
            show_legend: true,
            legend_corner : 'ne',
            legend_radius  : 45
        },

        GENOME: {
            DATA:{
                key_order : chrom_keys,
                key_length : chrom_leng
            },
            OPTIONS: {
                radial_grid_line_width : 2,
                label_layout_style:'clock',
                label_font_style:'16px helvetica'
           }
        },

        WEDGE:[
                 {
               PLOT : {
                height : 20,
                   type : 'karyotype'
            } ,
                DATA:{
                    data_array : cytoband
                },
                OPTIONS: {

                    legend_label : 'Karyotype Bands',
                    legend_description : 'Karyotype Bands',
                    listener : function() {return null;},
                    outer_padding: 15
                }
            },
            {   PLOT : {
                height : cnv_ring_height,
                   type : 'histogram'
            } ,
                DATA:{
                    data_array : cnv
                },
                OPTIONS: {
                    base_value : 0,
                    legend_label : 'Mean CNV',
                    legend_description : 'Mean Copy Number Variation',
                    listener : listener,
                    outer_padding: 15
                }
            },
            {
                PLOT : {

                    height : 60,
                    type : 'scatterplot'
                },
                DATA:{
                    data_array : link_density
                },
                OPTIONS: {
                    legend_label : 'Link Density',
                    legend_description : 'Density of Inferred Links',
                    min_value : 0,
                    max_value : 6,
                    base_value : 0,
                    radius : 3,
                    shape : 'circle',
                    outer_padding: 15,
                    stroke_style : null,
                    listener : listener
                }
            }
        ],

        TICKS : {
           DATA: {
                data_array: ticks.map(function(tick) { return vq.utils.VisUtils.extend({label:tick.value},tick);})
            },
            OPTIONS : {
                height : 120,
                display_legend : true,
                legend_corner : 'nw',
                fill_style : tick_colors,
                label_map : [{key:{label:'METH'}, label: 'Methylation'},
                            {key:{label:'CNV'} , label: 'Copy Number Variation'},
                            {key:{label:'hsa-miR'}, label:'uRNA'},
                            {key:{label:'Other'}, label: 'Gene Expression'}],
                listener : tick_listener
            }
        },

        NETWORK:{
            DATA:{
                data_array : network
            },
            OPTIONS: {
                outer_padding : 10,
                node_highlight_mode : 'isolate',
                node_fill_style : 'steelblue',
                link_stroke_style : 'red',
                link_alpha : 0.3,
                node_key : function(node) { return vq.utils.VisUtils.options_map(node)['label'];},
                node_tooltip_items :  {
                    Chr : 'chr',
                    Start : 'start',
                    End : 'end',
                    Label : function(c) { return vq.utils.VisUtils.options_map(c)['label']; }
                },
                link_tooltip_items :  {
                    'Node 1 Chr' : 'sourceNode.chr', 'Node 1 Start' : 'sourceNode.start', 'Node 1 End' : 'sourceNode.end',
                    'Node 1 Label' : function(c) { return vq.utils.VisUtils.options_map(c.sourceNode)['label'];},
                    'Node 2 Chr' : 'targetNode.chr', 'Node 2 Start' : 'targetNode.start', 'Node 2 End' : 'targetNode.end',
                    'Node 2 Label' : function(c) { return vq.utils.VisUtils.options_map(c.targetNode)['label'];}
		}
            }
        }
    };

    var listener = function(list) { return console.log("listener!"); };
    var circle_vis = new vq.CircVis();
    var dataObject ={DATATYPE : "vq.models.CircVisData", CONTENTS : data };

    circle_vis.draw(dataObject);

    return circle_vis;
}